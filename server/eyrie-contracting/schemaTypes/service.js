export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'page_name',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'hero_image',
      type: 'image',
      title: 'Hero Image',
      options: { hotspot: true }
    }
  ]
}