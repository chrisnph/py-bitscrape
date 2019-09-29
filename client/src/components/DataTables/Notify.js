const notify = data => {
  const audNotice = new Audio(
    "src/components/DataTables/assets/audio/notice.wav"
  );
  audNotice.load();

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
              console.log("playing");
            })
            .catch(e => {
              audNotice.load();
              audNotice.pause();
              audNotice.currentTime = 0;
              console.log(e);
            });
        }

        new Notification(post.title, {
          body: post.info,
          icon: "src/components/DataTables/assets/img/notice.png"
        });
      });
    }
  });
};

export default notify;
