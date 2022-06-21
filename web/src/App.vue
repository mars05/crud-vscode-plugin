<template>
  <router-view :key="key" />
</template>

<script>
import { useRouter } from 'vue-router'
import { defineComponent, reactive, toRefs, ref, nextTick, onMounted, unref } from 'vue'

export default {
  name: 'App',
  setup() {
    const dataMap = reactive({
      key: 0
    });
    const processClass = () => {
      if (document.body.classList.contains("vscode-dark")) {
        document.documentElement.classList.add("vscode-dark")
      } else {
        document.documentElement.classList.remove("vscode-dark")
      }
    };
    processClass();
    new MutationObserver(function (mutations, instance) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          processClass();
        }
      });
    }).observe(document.body, {
      attributes: true
    });
    // Handle the message inside the webview
    localStorage.vscodeState = localStorage.vscodeState || '{}'
    const router = useRouter()
    window.addEventListener('message', event => {
      const message = event.data; // The JSON data our extension sent
      switch (message.command) {
        case 'state':
          localStorage.vscodeState = JSON.stringify(message.data)
          break;
        case 'route':
          const route = message.data
          router.push(route)
          break;
      }
    });
    return { ...toRefs(dataMap) }
  }
}
</script>