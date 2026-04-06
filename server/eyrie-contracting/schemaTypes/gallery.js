export default {
  name: 'projects',
  title: 'Projects',
  type: 'document',
  fields: [
    {
      name: 'page_name',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'project1_media',
      title: 'Project1 Media',
      type: 'array',
      of: [
        { type: 'image', options: { hotspot: true } }
      ]
    },
    {
      name: 'project2_media',
      title: 'Project2 Media',
      type: 'array',
      of: [
        { type: 'image', options: { hotspot: true } }
      ]
    },
    {
      name: 'project3_media',
      title: 'Project3 Media',
      type: 'array',
      of: [
        { type: 'image', options: { hotspot: true } }
      ]
    }
  ]
}