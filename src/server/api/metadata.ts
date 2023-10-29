import { TrackSources } from '../../contracts/tracks'
import { z } from 'zod'

const oEmbedResponse = z.object({
  thumbnail_url: z.string().url(),
  title: z.string(),
  author_name: z.string().optional(),
  html: z.string(),
})
export class MetadataNotFoundError extends Error {}

function getOEmbedUrlForSource(url: string, source: TrackSources): string {
  switch (source) {
    case TrackSources.Spotify:
      return `https://open.spotify.com/oembed?url=${url}`
    default:
      return `https://noembed.com/embed?url=${url}`
  }
}
export async function getMetadataForUrl(
  mediaUrl: string,
  source: TrackSources
) {
  try {
    const url = getOEmbedUrlForSource(mediaUrl, source)
    const response = await fetch(url)
    const json = await response.json()

    if (json.error) {
      throw new MetadataNotFoundError('Could not fetch metadata for URL')
    }
    const { title, author_name, thumbnail_url } = oEmbedResponse.parse(json)

    return {
      title,
      artist: author_name,
      coverUrl: thumbnail_url,
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw Error(
        `Unexpected oEmbed API response from noembed API: ${e.issues[0].message} for data: ${e.issues[0].path[0]} `
      )
    }
    throw e
  }
}
