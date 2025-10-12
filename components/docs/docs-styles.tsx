export function DocsH1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mt-8 mb-4 text-center tracking-wide">
      {children}
    </h1>
  )
}

export function DocsH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-2 border-l-4 border-l-blue-500 pl-3 bg-blue-50 dark:bg-blue-950 rounded-r-lg py-2">
      {children}
    </h2>
  )
}

export function DocsH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mt-6 mb-2">
      {children}
    </h3>
  )
}

export function DocsP({ children }: { children: React.ReactNode }) {
  return (
    <p className="my-2 text-slate-700 dark:text-slate-300 leading-relaxed">
      {children}
    </p>
  )
}

export function DocsUL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="ml-8 mb-4 space-y-2 list-disc list-outside">
      {children}
    </ul>
  )
}

export function DocsOL({ children }: { children: React.ReactNode }) {
  return (
    <ol className="ml-8 mb-4 space-y-2 list-decimal list-outside">
      {children}
    </ol>
  )
}

export function DocsLI({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-slate-700 dark:text-slate-300 leading-relaxed marker:text-blue-500">
      {children}
    </li>
  )
}

export function DocsCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-slate-100 dark:bg-slate-800 text-blue-900 dark:text-blue-300 px-2 py-1 rounded text-sm font-mono">
      {children}
    </code>
  )
}

export function DocsPreCode({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 my-6 overflow-x-auto">
      <code className="text-blue-900 dark:text-blue-300 font-mono text-sm">
        {children}
      </code>
    </pre>
  )
}

export function DocsStrong({ children }: { children: React.ReactNode }) {
  return (
    <strong className="text-blue-900 dark:text-blue-200 font-semibold">
      {children}
    </strong>
  )
}

export function DocsHR() {
  return (
    <hr className="border-none border-t-2 border-slate-200 dark:border-slate-700 my-8" />
  )
}

export function DocsBadge({ 
  type, 
  children 
}: { 
  type: 'ok' | 'warn' | 'error' | 'info'
  children: React.ReactNode 
}) {
  const styles = {
    ok: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
    warn: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
    error: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
    info: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
  }
  
  return (
    <span className={`inline-block text-sm font-semibold rounded px-3 py-1 border mx-2 ${styles[type]}`}>
      {children}
    </span>
  )
}

export function DocsTable({ children }: { children: React.ReactNode }) {
  return (
    <table className="border-collapse w-full my-6 bg-slate-50 dark:bg-slate-800">
      {children}
    </table>
  )
}

export function DocsTH({ children }: { children: React.ReactNode }) {
  return (
    <th className="border border-slate-300 dark:border-slate-600 px-4 py-3 text-left bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200">
      {children}
    </th>
  )
}

export function DocsTD({ children }: { children: React.ReactNode }) {
  return (
    <td className="border border-slate-300 dark:border-slate-600 px-4 py-3">
      {children}
    </td>
  )
}