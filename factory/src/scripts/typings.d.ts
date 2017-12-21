declare module "*.json" {
  const value: any;
  export default value;
}

declare let process: {
  env: {
    NODE_ENV: string
  }
};
