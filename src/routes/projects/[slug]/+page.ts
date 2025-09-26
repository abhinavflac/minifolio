export const load = async ({ params }) => {
	try {
		// More robust approach - try multiple loading methods
		let module;
		let component;
		let metadata = {};
		
		// Method 1: Direct dynamic import
		try {
			const projectPath = `/src/content/projects/${params.slug}.mdx`;
			module = await import(projectPath);
		} catch (importError) {
			console.warn('Direct import failed, trying glob method:', importError);
			
			// Method 2: Fallback to glob
			const modules = import.meta.glob('/src/content/projects/*.mdx');
			const projectPath = `/src/content/projects/${params.slug}.mdx`;
			
			if (!modules[projectPath]) {
				throw new Error(`Project with slug "${params.slug}" not found`);
			}
			
			module = await modules[projectPath]();
		}
		
		if (!module) {
			throw new Error(`Failed to load project "${params.slug}"`);
		}
		
		// Extract component and metadata with multiple fallbacks
		component = module.default || module.Component || module;
		metadata = module.metadata || module.frontmatter || module.props || {};
		
		// Ensure we have a valid component
		if (!component || typeof component !== 'function') {
			throw new Error(`Invalid component for project "${params.slug}"`);
		}
		
		// Ensure metadata is an object
		if (!metadata || typeof metadata !== 'object') {
			metadata = {};
		}
		
		return {
			component,
			metadata
		};
	} catch (error) {
		console.error('Error loading project:', error);
		
		// Return a fallback component instead of throwing
		return {
			component: null,
			metadata: {
				title: 'Project Not Found',
				description: 'The requested project could not be loaded.'
			},
			error: error.message
		};
	}
};
