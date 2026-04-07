export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'page_name',
      type: 'string',
      title: 'Page Name'
    },
    {
      name: 'hero_media',
      title: 'Hero Media',
      type: 'object',
      fields: [  // <-- must be an array of fields
        {
          name: 'image',
          type: 'image',
          title: 'Image',
          options: { hotspot: true }
        },
        {
          name: 'video',
          type: 'file',
          title: 'Video',
          options: { accept: 'video/*' }
        }
      ]
    }
  ]
}