import path from 'path';
import fs from 'fs';
import defu from 'defu';
import type { Plugin } from 'rollup';
import {
  ResolveContext,
  ResolverFactory,
  ResolveOptions,
  Resolver,
  CachedInputFileSystem,
} from 'enhanced-resolve';

export interface ResolvePluginContext {
  resolver: Resolver;
  context: string;
  importee: string;
  importer?: string;
}

export interface EnhancedResolvePluginOptions {
  rootContext: string;
  shouldResolve?(ctx: ResolvePluginContext): boolean;
  getContext?(ctx: ResolvePluginContext): Record<string, any>;
  getResolveContext?(ctx: ResolvePluginContext): ResolveContext
  resolver?: Resolver;
  resolverOptions?: ResolveOptions;
}

const DEFAULT_OPTIONS: EnhancedResolvePluginOptions = {
  rootContext: process.cwd(),
  resolverOptions: {
    fileSystem: new CachedInputFileSystem(fs),
  },
};

export default function enhancedResolvePlugin(
  userOptions: Partial<EnhancedResolvePluginOptions>,
): Plugin {
  const options = defu(userOptions, DEFAULT_OPTIONS) as EnhancedResolvePluginOptions;
  const resolver = options.resolver || ResolverFactory.createResolver(options.resolverOptions!);

  return {
    name: 'enhanced-resolve',

    resolveId(importee, importer) {
      if (/^\0/.test(importee)) {
        return undefined;
      }

      const context = importer
        ? path.dirname(importer)
        : options.rootContext;

      if (context == null) {
        return undefined;
      }

      const ctx: ResolvePluginContext = {
        resolver,
        context,
        importer,
        importee,
      };

      if (options.shouldResolve && !options.shouldResolve(ctx)) {
        return undefined;
      }

      return new Promise<string | undefined>((resolve) => {
        resolver.resolve(
          options.getContext?.(ctx) || {},
          context,
          importee,
          options.getResolveContext?.(ctx) || {},
          (error, filepath) => {
            if (error) {
              resolve(undefined);
            } else {
              resolve(filepath || undefined);
            }
          },
        );
      });
    },
  };
}
