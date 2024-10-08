export class AddFaqDto {
  faqs: Faq[];
  phoneConfigId: string;
}

export type Faq = { question: string; answer: string };
