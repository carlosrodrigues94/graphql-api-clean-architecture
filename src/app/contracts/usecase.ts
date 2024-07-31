export abstract class UseCase<P, R> {
  abstract execute(data: P): Promise<R>;
}
