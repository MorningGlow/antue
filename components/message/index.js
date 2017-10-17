import Vue from 'vue'
import './style/index.js'
import MessageBox from './message-box'
import Message from './message'

let MessageBoxConstructor = Vue.extend(MessageBox)
let MessageConstructor = Vue.extend(Message)
let boxInstance
let boxEl
let messageInstances = []
let seed = 1
let prefixCls = 'ant-message'
let defaultTop = 24
let defaultDuration = 3
let getContainer

function getBoxEl () {
  boxInstance = boxInstance || new MessageBoxConstructor({
    propsData: {
      prefixCls,
      styles: { top: `${defaultTop}px` }
    }
  })
  boxInstance.vm = boxInstance.$mount()
  boxEl = boxInstance.vm.$el
  if (getContainer) {
    getContainer().appendChild(boxInstance.vm.$el)
  } else {
    document.body.appendChild(boxInstance.vm.$el)
  }
  return boxEl
}

function notice (content, duration, type, onClose) {
  const boxEl = getBoxEl()
  const options = {
    content: content,
    duration: duration,
    type: type,
    onClose: () => {
      close(id, onClose)
    }
  }
  let id = `${prefixCls}${seed++}`
  let messageInstance = new MessageConstructor({
    propsData: options
  })
  messageInstance.id = id
  messageInstance.vm = messageInstance.$mount()
  boxEl.appendChild(messageInstance.vm.$el)
  messageInstance.vm.visible = true
  messageInstances.push(messageInstance)

  return function () {
    messageInstance.vm.visible = false
  }
}

function close (id, userOnClose) {
  for (let i = 0, len = messageInstances.length; i < len; i++) {
    if (id === messageInstances[i].id) {
      if (typeof userOnClose === 'function') {
        userOnClose(messageInstances[i])
      }
      messageInstances.splice(i, 1)
      break
    }
  }
}

const onCloseDefault = () => true

let message = {
  info (content, duration = defaultDuration, onClose = onCloseDefault) {
    return notice(content, duration, 'info', onClose)
  },
  success (content, duration = defaultDuration, onClose = onCloseDefault) {
    return notice(content, duration, 'success', onClose)
  },
  error (content, duration = defaultDuration, onClose = onCloseDefault) {
    return notice(content, duration, 'error', onClose)
  },
  warn (content, duration = defaultDuration, onClose = onCloseDefault) {
    return notice(content, duration, 'warning', onClose)
  },
  warning (content, duration = defaultDuration, onClose = onCloseDefault) {
    return notice(content, duration, 'warning', onClose)
  },
  loading (content, duration = defaultDuration, onClose = onCloseDefault) {
    return notice(content, duration, 'loading', onClose)
  },
  config (options) {
    if (options.top !== undefined) {
      defaultTop = options.top
      boxInstance = null
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration
    }
    if (options.prefixCls !== undefined) {
      prefixCls = options.prefixCls
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer
    }
  },
  destroy () {
    if (boxInstance) {
      boxInstance.vm.$destroy(true)
      boxEl.parentNode.removeChild(boxEl)
    }
    boxInstance = null
  }
}

export default message
