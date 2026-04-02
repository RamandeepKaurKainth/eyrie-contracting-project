const projectId = 'eko1zm8z';
const dataset = 'production';

fetch('https://eko1zm8z.api.sanity.io/v2026-04-02/data/query/production?query=*[_type=="service"][0]')
  .then(res => res.json())
  .then(data => {
    // Use the correct field name
    const ref = data.result.hero_image.asset._ref;

    // Split the ref into parts
    const [id, dimensions, format] = ref.replace('image-', '').split('-');

    // Construct the Sanity CDN URL
    const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;

    // Apply as background image
    document.querySelector('.about-hero').style.backgroundImage = `url(${url})`;
  })
  .catch(err => console.error('Error loading image:', err));