const projectId = 'eko1zm8z';
const dataset = 'production';

fetch('https://eko1zm8z.api.sanity.io/v2026-04-02/data/query/production?query=*[_type=="about"][0]')
  .then(res => res.json())
  .then(data => {
    const ref = data.result.image.asset._ref;
    const [id, dimensions, format] = ref.replace('image-', '').split('-');
    const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
    document.querySelector('.about-hero').style.backgroundImage = `url(${url})`;
  });
