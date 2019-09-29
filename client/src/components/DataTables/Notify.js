const notify = data => {
  const audNotice = new Audio(
    "src/components/DataTables/assets/audio/notice.wav"
  );

  Notification.requestPermission().then(res => {
    if (res === "granted") {
      data.map(post => {
        const audPromise = audNotice.play();
        audNotice.pause();
        audNotice.currentTime = 0;
        const promise = audNotice.play();
        if (promise !== undefined) {
          promise
            .then(_ => {
              
            })
            .catch(e => {
              throw new Error(e)
            });
        }

        new Notification(post.title, {
          body: post.info.replace(/<\/?[^>]+>/ig, " ").trim(),
          icon: "src/components/DataTables/assets/img/notice.png"
        });
      });
    }
  });
};

export default notify;
