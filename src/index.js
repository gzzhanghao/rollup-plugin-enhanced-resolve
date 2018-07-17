const { dirname } = require('path')
const defaultsDeep = require('lodash.defaultsdeep')
const { createFilter } = require('rollup-pluginutils')
const { ResolverFactory, NodeJsInputFileSystem } = require('enhanced-resolve')

const DEFAULT_OPTIONS = {
  rootContext: process.cwd(),
  shouldResolve: () => true,
  getContext: () => ({}),
  getResolveContext: () => ({}),
  resolver: null,
  resolverOptions: {
    fileSystem: new NodeJsInputFileSystem,
  },
}

module.exports = function(options) {
  defaultsDeep(options, DEFAULT_OPTIONS)

  const resolver = options.resolver || ResolverFactory.createResolver(options.resolverOptions)

  return {

    name: 'enhanced-resolve',

    resolveId(importee, importer) {
      if (/^\0/.test(importee)) {
        return
      }
      if (!importer && !options.rootContext) {
        return
      }
      const context = dirname(importer || options.rootContext)
      const ctx = { resolver, context, importer, importee }
      if (!options.shouldResolve(ctx)) {
        return
      }
      return new Promise((resolve, reject) => {
        resolver.resolve(options.getContext(ctx), importee, context, options.getResolveContext(ctx), (error, filepath) => {
          if (error) {
            return resolve()
          }
          resolve(filepath)
        })
      })
    },
  }
}
