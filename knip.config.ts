import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  // shadcn/ui primitives intentionally expose a few extra named exports
  // (e.g. SelectSeparator) we don't all use — ignore export-level noise here.
  // Unused *whole* ui files are still pruned manually during audits.
  ignore: ['src/components/ui/**'],
}

export default config
