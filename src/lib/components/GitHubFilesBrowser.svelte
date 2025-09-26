<script lang="ts">
	import { onMount } from 'svelte';
	
	export let repoUrl: string;
	export let title: string = 'Repository Files';
	
	interface GitHubFile {
		name: string;
		path: string;
		type: 'file' | 'dir';
		size?: number;
		download_url?: string;
		html_url: string;
	}
	
	let files: GitHubFile[] = [];
	let expandedFolders: Set<string> = new Set();
	let folderContents: Record<string, GitHubFile[]> = {};
	let loading = true;
	let error: string | null = null;
	let selectedFile: GitHubFile | null = null;
	let fileContent = '';
	let loadingContent = false;
	
	// Extract owner and repo from GitHub URL
	function getRepoInfo(url: string) {
		const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
		if (match) {
			return { owner: match[1], repo: match[2] };
		}
		return null;
	}
	
	// Format file size
	function formatFileSize(bytes?: number): string {
		if (!bytes) return '';
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
	}
	
	// Check if file is an image
	function isImageFile(filename: string): boolean {
		const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp'];
		return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
	}
	
	// Check if file is binary
	function isBinaryFile(filename: string): boolean {
		const binaryExtensions = ['.exe', '.bin', '.zip', '.rar', '.tar', '.gz', '.pdf', '.doc', '.docx'];
		return binaryExtensions.some(ext => filename.toLowerCase().endsWith(ext));
	}
	
	// Fetch repository contents
	async function fetchRepoContents(path = '') {
		const repoInfo = getRepoInfo(repoUrl);
		if (!repoInfo) {
			error = 'Invalid GitHub repository URL';
			loading = false;
			return;
		}
		
		try {
			const url = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${path}`;
			const response = await fetch(url);
			
			if (!response.ok) {
				if (response.status === 403) {
					const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
					if (rateLimitRemaining === '0') {
						const resetTime = response.headers.get('X-RateLimit-Reset');
						const resetDate = new Date(parseInt(resetTime) * 1000);
						throw new Error(`GitHub API rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}`);
					}
				}
				if (response.status === 404) {
					throw new Error('Repository not found or is private');
				}
				throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
			}
			
			const data = await response.json();
			return Array.isArray(data) ? data : [];
		} catch (err) {
			console.error('Failed to fetch repository contents:', err);
			error = err.message || 'Failed to load repository contents';
			return [];
		}
	}
	
	// Fetch folder contents
	async function fetchFolderContents(path: string) {
		const contents = await fetchRepoContents(path);
		console.log(`Folder "${path}" file order:`, contents.map(f => f.name));
		// Sort like GitHub: folders first, then files, each group alphabetically
		const sortedContents = contents.sort((a, b) => {
			// Folders come before files
			if (a.type === 'dir' && b.type === 'file') return -1;
			if (a.type === 'file' && b.type === 'dir') return 1;
			// Within same type, sort alphabetically
			return a.name.localeCompare(b.name);
		});
		folderContents[path] = sortedContents;
		folderContents = { ...folderContents };
	}
	
	// Toggle folder expansion
	async function toggleFolder(file: GitHubFile) {
		if (file.type !== 'dir') return;
		
		const newExpanded = new Set(expandedFolders);
		if (expandedFolders.has(file.path)) {
			newExpanded.delete(file.path);
		} else {
			newExpanded.add(file.path);
			if (!folderContents[file.path]) {
				await fetchFolderContents(file.path);
			}
		}
		expandedFolders = newExpanded;
	}
	
	// Fetch file content
	async function fetchFileContent(file: GitHubFile) {
		if (file.type !== 'file' || !file.download_url) return;
		
		selectedFile = file;
		loadingContent = true;
		
		try {
			if (isImageFile(file.name)) {
				fileContent = '';
				loadingContent = false;
				return;
			}
			
			if (isBinaryFile(file.name)) {
				fileContent = 'This is a binary file. Click the download button to get the file.';
				loadingContent = false;
				return;
			}
			
			const response = await fetch(file.download_url);
			if (response.ok) {
				const content = await response.text();
				fileContent = content;
			}
		} catch (err) {
			console.error('Failed to fetch file content:', err);
			fileContent = 'Error loading file content.';
		} finally {
			loadingContent = false;
		}
	}
	
	// Handle file/folder click
	function handleFileClick(file: GitHubFile) {
		if (file.type === 'dir') {
			toggleFolder(file);
		} else {
			fetchFileContent(file);
		}
	}
	
	// Render file tree recursively
	function renderFileTree(items: GitHubFile[], depth = 0) {
		return items;
	}
	
	onMount(async () => {
		const contents = await fetchRepoContents();
		if (error) {
			loading = false;
			return;
		}
		
		console.log('GitHub API file order:', contents.map(f => f.name));
		// Sort like GitHub: folders first, then files, each group alphabetically
		const sortedContents = contents.sort((a, b) => {
			// Folders come before files
			if (a.type === 'dir' && b.type === 'file') return -1;
			if (a.type === 'file' && b.type === 'dir') return 1;
			// Within same type, sort alphabetically
			return a.name.localeCompare(b.name);
		});
		files = sortedContents;
		
		// Pre-fetch folder contents to show counts immediately
		// Only if there are few folders to avoid rate limits
		const folders = sortedContents.filter(file => file.type === 'dir');
		if (folders.length <= 5) {
			try {
				const folderPromises = folders.map(folder => fetchFolderContents(folder.path));
				await Promise.all(folderPromises);
			} catch (err) {
				console.warn('Pre-fetching folder contents failed:', err);
				// Continue anyway, folders will load on demand
			}
		}
		
		loading = false;
	});
</script>

<div class="github-browser">
	<div class="browser-header">
		<h3 class="browser-title">{title}</h3>
		<a href={repoUrl} target="_blank" rel="noopener noreferrer" class="github-link">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
			</svg>
			View on GitHub
		</a>
	</div>
	
	<div class="browser-content">
		{#if loading}
			<div class="loading-state">
				<div class="loading-spinner"></div>
				<p>Loading repository...</p>
			</div>
		{:else if error}
			<div class="error-state">
				<p>{error}</p>
				{#if error.includes('rate limit')}
					<p class="text-sm mt-2 text-gray-400">
						Try again in a few minutes, or visit the repository directly using the "View on GitHub" button above.
					</p>
				{:else}
					<button 
						class="retry-btn mt-3" 
						on:click={() => {
							error = '';
							loading = true;
							onMount();
						}}
					>
						Retry
					</button>
				{/if}
			</div>
		{:else}
			<div class="file-explorer">
				<div class="file-tree">
					{#each files as file}
						<div class="file-item" class:expanded={expandedFolders.has(file.path)}>
							<button 
								class="file-button" 
								on:click={() => handleFileClick(file)}
								class:selected={selectedFile?.path === file.path}
								class:expanded={file.type === 'dir' && expandedFolders.has(file.path)}
							>
								<div class="file-left">
									<div class="file-icon">
										{#if file.type === 'dir'}
											{#if expandedFolders.has(file.path)}
												<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="chevron">
													<path d="M7,10L12,15L17,10H7Z"/>
												</svg>
											{:else}
												<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="chevron">
													<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
												</svg>
											{/if}
											<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="20" width="20" class="folder-icon">
												<path d="M208,56V200a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z" opacity="0.2"></path>
												<path d="M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,80H136V56h64ZM120,56v64H56V56ZM56,136h64v64H56Zm144,64H136V136h64v64Z"></path>
											</svg>
										{:else}
											<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="20" width="20" class="file-icon">
												<path d="M208,32V192H72a24,24,0,0,0-24,24V56A24,24,0,0,1,72,32h40v96l32-24,32,24V32Z" opacity="0.2"></path>
												<path d="M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24ZM120,40h48v72L148.79,97.6a8,8,0,0,0-9.6,0L120,112Zm80,144H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40h32v88a8,8,0,0,0,12.8,6.4L144,114l27.21,20.4A8,8,0,0,0,176,136a8.1,8.1,0,0,0,3.58-.84A8,8,0,0,0,184,128V40h16Z"></path>
											</svg>
										{/if}
									</div>
									<span class="file-name">{file.name}</span>
								</div>
								<div class="file-right">
									{#if file.type === 'file'}
										<span class="file-size">{formatFileSize(file.size)}</span>
										{#if file.download_url}
											<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="external-link">
												<path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
											</svg>
										{/if}
									{:else}
										<span class="folder-count">
											{#if folderContents[file.path]}
												{@const folders = folderContents[file.path].filter(f => f.type === 'dir').length}
												{@const files = folderContents[file.path].filter(f => f.type === 'file').length}
												{#if folders > 0 && files > 0}
													{folders} {folders === 1 ? 'folder' : 'folders'}, {files} {files === 1 ? 'file' : 'files'}
												{:else if folders > 0}
													{folders} {folders === 1 ? 'folder' : 'folders'}
												{:else if files > 0}
													{files} {files === 1 ? 'file' : 'files'}
												{/if}
											{/if}
										</span>
									{/if}
								</div>
							</button>
							
							{#if file.type === 'dir' && expandedFolders.has(file.path) && folderContents[file.path]}
									<div class="nested-files">
										{#each folderContents[file.path] as nestedFile}
											<button 
												class="file-button nested" 
												on:click={() => handleFileClick(nestedFile)}
												class:selected={selectedFile?.path === nestedFile.path}
												class:expanded={nestedFile.type === 'dir' && expandedFolders.has(nestedFile.path)}
											>
												<div class="file-left">
													<div class="file-icon">
														{#if nestedFile.type === 'dir'}
															{#if expandedFolders.has(nestedFile.path)}
																<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="chevron">
																	<path d="M7,10L12,15L17,10H7Z"/>
																</svg>
															{:else}
																<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="chevron">
																	<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
																</svg>
															{/if}
															<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="20" width="20" class="folder-icon">
																<path d="M208,56V200a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z" opacity="0.2"></path>
																<path d="M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,80H136V56h64ZM120,56v64H56V56ZM56,136h64v64H56Zm144,64H136V136h64v64Z"></path>
															</svg>
														{:else}
															<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="20" width="20" class="file-icon">
																<path d="M208,32V192H72a24,24,0,0,0-24,24V56A24,24,0,0,1,72,32h40v96l32-24,32,24V32Z" opacity="0.2"></path>
																<path d="M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24ZM120,40h48v72L148.79,97.6a8,8,0,0,0-9.6,0L120,112Zm80,144H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40h32v88a8,8,0,0,0,12.8,6.4L144,114l27.21,20.4A8,8,0,0,0,176,136a8.1,8.1,0,0,0,3.58-.84A8,8,0,0,0,184,128V40h16Z"></path>
															</svg>
														{/if}
													</div>
													<span class="file-name">{nestedFile.name}</span>
												</div>
												<div class="file-right">
													{#if nestedFile.type === 'file'}
														<span class="file-size">{formatFileSize(nestedFile.size)}</span>
														{#if nestedFile.download_url}
															<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="external-link">
																<path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
															</svg>
														{/if}
													{:else}
														<span class="folder-count">
															{#if folderContents[nestedFile.path]}
																{@const folders = folderContents[nestedFile.path].filter(f => f.type === 'dir').length}
																{@const files = folderContents[nestedFile.path].filter(f => f.type === 'file').length}
																{#if folders > 0 && files > 0}
																	{folders} {folders === 1 ? 'folder' : 'folders'}, {files} {files === 1 ? 'file' : 'files'}
																{:else if folders > 0}
																	{folders} {folders === 1 ? 'folder' : 'folders'}
																{:else if files > 0}
																	{files} {files === 1 ? 'file' : 'files'}
																{/if}
															{/if}
														</span>
													{/if}
												</div>
											</button>
											
											<!-- Nested subfolder contents -->
											{#if nestedFile.type === 'dir' && expandedFolders.has(nestedFile.path) && folderContents[nestedFile.path]}
												<div class="nested-files level-2">
													{#each folderContents[nestedFile.path] as subNestedFile}
														<button 
															class="file-button nested level-2" 
															on:click={() => handleFileClick(subNestedFile)}
															class:selected={selectedFile?.path === subNestedFile.path}
														>
															<div class="file-left">
																<div class="file-icon">
																	{#if subNestedFile.type === 'dir'}
																		<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="20" width="20" class="folder-icon">
																			<path d="M208,56V200a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z" opacity="0.2"></path>
																			<path d="M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,80H136V56h64ZM120,56v64H56V56ZM56,136h64v64H56Zm144,64H136V136h64v64Z"></path>
																		</svg>
																	{:else}
																		<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="20" width="20" class="file-icon">
																			<path d="M208,32V192H72a24,24,0,0,0-24,24V56A24,24,0,0,1,72,32h40v96l32-24,32,24V32Z" opacity="0.2"></path>
																			<path d="M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24ZM120,40h48v72L148.79,97.6a8,8,0,0,0-9.6,0L120,112Zm80,144H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40h32v88a8,8,0,0,0,12.8,6.4L144,114l27.21,20.4A8,8,0,0,0,176,136a8.1,8.1,0,0,0,3.58-.84A8,8,0,0,0,184,128V40h16Z"></path>
																		</svg>
																	{/if}
																</div>
																<span class="file-name">{subNestedFile.name}</span>
															</div>
															<div class="file-right">
																{#if subNestedFile.type === 'file'}
																	<span class="file-size">{formatFileSize(subNestedFile.size)}</span>
																	{#if subNestedFile.download_url}
																		<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="external-link">
																			<path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
																		</svg>
																	{/if}
																{:else}
																	<span class="folder-count">
																		{#if folderContents[subNestedFile.path]}
																			{@const folders = folderContents[subNestedFile.path].filter(f => f.type === 'dir').length}
																			{@const files = folderContents[subNestedFile.path].filter(f => f.type === 'file').length}
																			{#if folders > 0 && files > 0}
																				{folders} {folders === 1 ? 'folder' : 'folders'}, {files} {files === 1 ? 'file' : 'files'}
																			{:else if folders > 0}
																				{folders} {folders === 1 ? 'folder' : 'folders'}
																			{:else if files > 0}
																				{files} {files === 1 ? 'file' : 'files'}
																			{/if}
																		{/if}
																	</span>
																{/if}
															</div>
														</button>
													{/each}
												</div>
											{/if}
										{/each}
									</div>
							{/if}
						</div>
					{/each}
				</div>
				
			</div>
		{/if}
	</div>
</div>

<!-- File Preview Modal -->
{#if selectedFile}
	<div class="modal-overlay" on:click={() => selectedFile = null}>
		<div class="modal-content" on:click|stopPropagation>
			<div class="modal-header">
				<span class="modal-title">{selectedFile.name}</span>
				<div class="modal-actions">
					{#if selectedFile.download_url}
						<a 
							href={selectedFile.download_url} 
							download={selectedFile.name}
							class="download-btn"
						>
							Download
						</a>
					{/if}
					<button class="close-btn" on:click={() => selectedFile = null}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
						</svg>
					</button>
				</div>
			</div>
			
			<div class="modal-body">
				{#if loadingContent}
					<div class="loading-state">
						<div class="loading-spinner"></div>
						<p>Loading file...</p>
					</div>
				{:else if isImageFile(selectedFile.name) && selectedFile.download_url}
					<img src={selectedFile.download_url} alt={selectedFile.name} class="preview-image" />
				{:else if fileContent}
					<pre class="file-code"><code>{fileContent}</code></pre>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.github-browser {
		border-radius: 1.5rem;
		backdrop-filter: blur(10px);
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
		margin: 1.5rem 0;
		overflow: hidden;
	}
	
	.browser-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.05);
	}
	
	.browser-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: white;
	}
	
	.github-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s ease;
	}
	
	.github-link:hover {
		color: white;
	}
	
	.browser-content {
		padding: 0;
	}
	
	.file-explorer {
		display: flex;
		flex-direction: column;
	}
	
	.file-tree {
		width: 100%;
	}
	
	.file-item {
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.file-item:last-child {
		border-bottom: none;
	}
	
	.file-button {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 1rem 1.5rem;
		background: transparent;
		border: none;
		border-radius: 0;
		color: rgba(255, 255, 255, 0.8);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
		justify-content: space-between;
	}
	
	.file-button:hover {
		background: rgba(255, 255, 255, 0.05);
		color: white;
	}
	
	.file-button.selected {
		background: rgba(59, 130, 246, 0.15);
		color: white;
	}
	
	.file-button.expanded {
		background: rgba(255, 255, 255, 0.08);
		color: white;
	}
	
	.file-button.expanded:hover {
		background: rgba(255, 255, 255, 0.12);
	}
	
	.file-button.nested {
		padding-left: 3rem;
		font-size: 0.875rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	.file-button.nested:last-child {
		border-bottom: none;
	}
	
	.file-button.nested.level-2 {
		padding-left: 4.5rem;
		font-size: 0.8rem;
	}
	
	.file-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
		min-width: 0;
	}
	
	.file-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
	}
	
	.file-icon {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		color: rgba(255, 255, 255, 0.6);
	}
	
	.chevron {
		margin-right: 0.25rem;
		color: rgba(255, 255, 255, 0.4);
	}
	
	.folder-icon {
		color: rgba(59, 130, 246, 0.8);
	}
	
	.file-icon svg {
		color: rgba(255, 255, 255, 0.7);
	}
	
	.file-name {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.file-size {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		min-width: 60px;
		text-align: right;
	}
	
	.folder-count {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.4);
		min-width: 60px;
		text-align: right;
	}
	
	.external-link {
		color: rgba(255, 255, 255, 0.4);
		transition: color 0.2s ease;
	}
	
	.file-button:hover .external-link {
		color: rgba(255, 255, 255, 0.7);
	}
	
	.nested-files {
		background: rgba(0, 0, 0, 0.1);
	}
	
	.file-preview {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	
	.preview-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.preview-title {
		font-weight: 600;
		color: white;
	}
	
	.download-btn {
		padding: 0.5rem 1rem;
		background: rgba(59, 130, 246, 0.15);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 0.75rem;
		color: rgba(59, 130, 246, 0.9);
		text-decoration: none;
		font-size: 0.875rem;
		transition: all 0.2s ease;
		box-shadow: 
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
	}
	
	.download-btn:hover {
		background: rgba(59, 130, 246, 0.25);
		border-color: rgba(59, 130, 246, 0.4);
		color: white;
		transform: translateY(-1px);
		box-shadow: 
			0 6px 8px -1px rgba(0, 0, 0, 0.15),
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
	}
	
	.preview-content {
		flex: 1;
		overflow: hidden;
	}
	
	.file-code {
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.75rem;
		padding: 1rem;
		overflow: auto;
		max-height: 300px;
		font-family: 'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
		font-size: 0.875rem;
		color: #e5e7eb;
		margin: 0;
	}
	
	.preview-image {
		max-width: 100%;
		max-height: 300px;
		border-radius: 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.loading-state, 	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
		color: rgba(255, 255, 255, 0.7);
	}
	
	.retry-btn {
		background: rgba(59, 130, 246, 0.15);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 0.75rem;
		color: rgba(59, 130, 246, 0.9);
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
	}
	
	.retry-btn:hover {
		background: rgba(59, 130, 246, 0.25);
		border-color: rgba(59, 130, 246, 0.4);
		color: white;
		transform: translateY(-1px);
		box-shadow: 
			0 6px 8px -1px rgba(0, 0, 0, 0.15),
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
	}
	
	.loading-spinner {
		width: 2rem;
		height: 2rem;
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-top: 2px solid rgba(255, 255, 255, 0.8);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 2rem;
	}
	
	.modal-content {
		background: rgba(17, 24, 39, 0.3);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.5rem;
		max-width: 90vw;
		max-height: 90vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 
			0 25px 50px -12px rgba(0, 0, 0, 0.25),
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border-radius: 1.5rem 1.5rem 0 0;
	}
	
	.modal-title {
		font-weight: 600;
		color: white;
		font-size: 1.125rem;
	}
	
	.modal-actions {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	
	.close-btn {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 0.75rem;
		transition: all 0.2s ease;
		box-shadow: 
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
	}
	
	.close-btn:hover {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 255, 255, 0.2);
		color: white;
		transform: translateY(-1px);
		box-shadow: 
			0 6px 8px -1px rgba(0, 0, 0, 0.15),
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
	}
	
	.modal-body {
		flex: 1;
		padding: 1.5rem;
		overflow: auto;
	}
	
	.modal-body .file-code {
		margin: 0;
		max-height: none;
		border-radius: 1rem;
	}
	
	.modal-body .preview-image {
		max-width: 100%;
		max-height: 70vh;
		display: block;
		margin: 0 auto;
	}
	
	@media (max-width: 768px) {
		.modal-overlay {
			padding: 1rem;
		}
		
		.modal-content {
			max-width: 100%;
			max-height: 100%;
		}
	}
</style>
