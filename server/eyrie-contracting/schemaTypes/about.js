export default {
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true }
    }
  ]
}