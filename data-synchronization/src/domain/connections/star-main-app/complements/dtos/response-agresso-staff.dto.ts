export class ResponseAgressoStaffDto<T> {
  public content: T;
  public page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}
