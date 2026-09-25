import { ListAssessment } from './myList';
export type PdfThumbnails = Record<string, { hex: string; width: number; height: number }>;
export function bytesToBase64(bytes: Uint8Array): string;
export function createListPdf(assessment: ListAssessment, options?: { generatedAt?: string; thumbnails?: PdfThumbnails; title?: string }): Uint8Array;
