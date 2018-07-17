# rollup-plugin-enhanced-resolve

Resolve modules using webpack's [enhanced-resolve](https://github.com/webpack/enhanced-resolve).

## Usage

```javascript
import path from 'path'
import enhancedResolve from 'rollup-plugin-enhanced-resolve'

export default {
  plugins: [
    enhancedResolve({
      // Root context for resolving entry module
      rootContext: path.resolve('src'), // Default: process.cwd()

      // Check if the plugin should resolve a module
      shouldResolve({ resolver, context, importer, importee }) {
        return true
      },

      // Get `context` argument for enhanced-resolver
      getContext({ resolver, context, importer, importee }) {
        return {}
      },

      // Get `resolveContext` argument for enhanced-resolver
      getResolveContext({ resolver, context, importer, importee }) {
        return {}
      },

      // Existed resolver to be used
      resolver: ResolverFactory.createResolver(resolverOptions), // Default: null

      // Options for creating enhanced resolver
      resolverOptions: {

        fileSystem: new NodeJsInputFileSystem,

        alias: {
          '@': path.resolve('src')
        }
      }
    })
  ]
}
```
