const state = {
    contextMenu01: false,
    modalDialog01: false
}

const mutations = {
    'SET_EVENT' (state, event) {
        console.log('set event : ', event.key, event.value) 
        state[event.key] = event.value
    }
};

const actions = {
    setEvent: ({commit}, event) => {
        console.log('setEvent called : ',event)
        commit('SET_EVENT', event)
    },
    setKeyUpEsc: () => {
        console.log('setKeyUpEsc called : ',event)
        state.contextMenu01 = false
        state.modalDialog01 = false
    }
};

const getters = {
    showContextMenu01: (state) => {
        return state.contextMenu01
    },
    showModalDialog01: (state) => {
        return state.modalDialog01
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};