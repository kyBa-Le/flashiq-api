export class Quiz {
  constructor(
    readonly cardId: string,
    readonly term: string,
    readonly choices: string[] | null,
    readonly correctAnswer: string
  ) {}
}
