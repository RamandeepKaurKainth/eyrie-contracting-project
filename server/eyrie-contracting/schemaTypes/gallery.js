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
      name: 'hero_media',
      title: 'Hero Media',
      type: 'object',      // single hero media
      fields: [
        { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
        { name: 'video', type: 'file', title: 'Video', options: { accept: 'video/*' } }
      ]
    },
    {
      name: 'project1_media',
      title: 'Project1 Media',
      type: 'array',
      of: [
        { type: 'image', options: { hotspot: true } },
        { type: 'file', options: { accept: 'video/*' } }
      ]
    },
    {
      name: 'project2_media',
      title: 'Project2 Media',
      type: 'array',
      of: [
        { type: 'image', options: { hotspot: true } },
        { type: 'file', options: { accept: 'video/*' } }
      ]
    },
    {
      name: 'project3_media',
      title: 'Project3 Media',
      type: 'array',
      of: [
        { type: 'image', options: { hotspot: true } },
        { type: 'file', options: { accept: 'video/*' } }
      ]
    }
  ]
}