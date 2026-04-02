export default {
  name: 'projects',
  title: 'Projects',
  type: 'document',
  fields: [
    {
      name: 'page_name',          // fixed: replaced space with underscore
      type: 'string',
      title: 'Title'
    },
    {
      name: 'hero_image',         // fixed
      type: 'image',
      title: 'Hero Image',
      options: { hotspot: true }
    },
    {
      name: 'images_project1',    // fixed
      title: 'Project1 Images',
      type: 'array',
      of: [{ type: 'image' }]
    },
    {
      name: 'images_project2',    // fixed
      title: 'Project2 Images',
      type: 'array',
      of: [{ type: 'image' }]
    },
    {
      name: 'images_project3',    // fixed
      title: 'Project3 Images',
      type: 'array',
      of: [{ type: 'image' }]
    }
  ]
}