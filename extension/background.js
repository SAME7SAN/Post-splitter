// يفتح المقسّم في نافذة صغيرة مستقلة حتى لا تُغلق عند الضغط داخل صفحة Threads.
const api = globalThis.browser ?? globalThis.chrome;

api.action.onClicked.addListener(async () => {
  const url = api.runtime.getURL("app.html");
  try {
    await api.windows.create({ url, type: "popup", width: 460, height: 780 });
  } catch (e) {
    api.tabs.create({ url });
  }
});
