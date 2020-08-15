import 'egg';

import pluginContext from './app/extend/context'
import pluginApplication from './app/extend/application'


type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;

declare module 'egg' {
  interface Application extends AutoInstanceType<typeof pluginApplication> {
    model: IModel,
  }
  
  interface Context extends AutoInstanceType<typeof pluginContext> {
  }

}