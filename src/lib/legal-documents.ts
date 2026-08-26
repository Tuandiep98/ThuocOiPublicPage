export type DocumentType = 'terms_of_service' | 'privacy_policy';
export type LegalLocale = 'vi' | 'en';

export interface LegalDocument {
  document_type: DocumentType;
  locale: LegalLocale;
  version: string;
  title: string;
  content_markdown: string;
  effective_at: string;
  published_at: string;
}

export interface LegalSiteConfiguration {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

const defaultConfiguration: LegalSiteConfiguration = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, ''),
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

export class LegalDocumentError extends Error {}

export async function fetchCurrentLegalDocument(
  documentType: DocumentType,
  locale: LegalLocale,
  fetcher: typeof fetch = fetch,
  configuration: LegalSiteConfiguration = defaultConfiguration,
): Promise<LegalDocument> {
  const { supabaseUrl, supabaseAnonKey } = configuration;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new LegalDocumentError('Legal site configuration is missing.');
  }

  const params = new URLSearchParams({
    select: 'document_type,locale,version,title,content_markdown,effective_at,published_at',
    document_type: `eq.${documentType}`,
    locale: `eq.${locale}`,
  });
  const response = await fetcher(
    `${supabaseUrl}/rest/v1/legal_document_current?${params.toString()}`,
    {
      cache: 'no-store',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Cache-Control': 'no-cache',
      },
    },
  );

  if (!response.ok) {
    throw new LegalDocumentError(`Legal document request failed (${response.status}).`);
  }

  const documents: unknown = await response.json();
  if (!Array.isArray(documents) || documents.length !== 1) {
    throw new LegalDocumentError('No published legal document is available.');
  }

  return documents[0] as LegalDocument;
}

export function preferredLocale(search: string): LegalLocale {
  const queryLocale = new URLSearchParams(search).get('lang');
  if (queryLocale === 'vi' || queryLocale === 'en') return queryLocale;
  return navigator.language.toLowerCase().startsWith('vi') ? 'vi' : 'en';
}
