const projectId = 'eko1zm8z';
const dataset = 'production';

fetch(`https://${projectId}.api.sanity.io/v2026-04-02/data/query/${dataset}?query=*[_type=="service"][0]`)
  .then(res => res.json())
  .then(data => {
    const media = data.result.hero_media;

    if (!media) return;

    // If it's an image
    if (media.image && media.image.asset?._ref) {
      const ref = media.image.asset._ref;
      const [id, dimensions, format] = ref.replace('image-', '').split('-');
      const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;

      document.querySelector('.about-hero').style.backgroundImage = `url(${url})`;
    }

    // If it's a video
    else if (media.video && media.video.asset?._ref) {
      const ref = media.video.asset._ref;
       const [id, format] = ref.replace('file-', '').split('-');
      const url = `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${format}`;
      const container = document.querySelector('.about-hero');
      //console.log(url);
      container.innerHTML = `<video autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;">
        <source src="${url}" type="video/${format}">
      </video>`;
    }
  })
  .catch(err => console.error('Error loading media:', err));