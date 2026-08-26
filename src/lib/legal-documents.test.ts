import { describe, expect, it, vi } from 'vitest';

import { fetchCurrentLegalDocument } from './legal-documents';

describe('fetchCurrentLegalDocument', () => {
  it('reads the current public document without browser caching', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            document_type: 'terms_of_service',
            locale: 'vi',
            version: '1.0.0',
            title: 'Điều khoản sử dụng',
            content_markdown: 'Nội dung',
            effective_at: '2026-08-26T00:00:00.000Z',
            published_at: '2026-08-26T00:00:00.000Z',
          },
        ]),
        { status: 200 },
      ),
    ) as unknown as typeof fetch;

    const document = await fetchCurrentLegalDocument(
      'terms_of_service',
      'vi',
      fetcher,
      {
        supabaseUrl: 'https://example.supabase.co',
        supabaseAnonKey: 'public-anon-key',
      },
    );

    expect(document.version).toBe('1.0.0');
    expect(fetcher).toHaveBeenCalledWith(
      expect.stringContaining('legal_document_current'),
      expect.objectContaining({ cache: 'no-store' }),
    );
  });
});
