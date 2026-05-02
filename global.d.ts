declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

declare module 'next' {
  export type Metadata = {
    title?: string
    description?: string
  }
}

declare module 'next/link' {
  const Link: (props: any) => any
  export default Link
}


declare module 'react' {
  export const useState: any
  export const useMemo: any
}
