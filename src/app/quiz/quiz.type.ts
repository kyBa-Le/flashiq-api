export class Quiz {
  constructor(
    readonly cardId: string,
    readonly term: string,
    readonly example: string | null,
    readonly image_url: string | null,
    readonly choices: string[] | null,
    readonly correctAnswer: string
  ) {}
}
