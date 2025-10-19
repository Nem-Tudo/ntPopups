// 1. Declaração para CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// 2. Declaração para Módulos Padrões JSX (React)
// Isso resolve o erro "Cannot find namespace 'JSX'" e problemas com 'React'
declare namespace React {
    interface ComponentType<P = any> {}
}

declare module 'react-icons/*' {
  const content: any;
  export default content;
}