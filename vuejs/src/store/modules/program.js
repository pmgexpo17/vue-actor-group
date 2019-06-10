import factory from 'vue-actor-group'

const defaultLayout = {
    arrowHeadSize: 12,
    fillColor: 'lightyellow',
    font: 'courier new',
    fontSize: 16,  
    halfBodyWidth: 10,
    initBodyHeight: 240,
    leftMargin: 100,
    leftPad: 7,
    topMargin: 20,
    topPad: 7,
    strokeWidth: 2
  }

class UmlProgram {
    constructor(layout) {
        this.actors = {}
        this.profiles = []
        this.program = []
        this.actorFrom = null
        this.others = []
        this.layout = layout
        this.prevArtifact = {bodyYOffset:0, bodyHtFactor:1}
    }

    get timestamp() {
        return new Date().getTime().toString()
    }

    addActor(actorName) {
        const actor = factory.new(actorName)
        actor.id = this.timestamp
        actor.svgOpacity = this.prevArtifact.actorFrom ? 0.5 : 1
        this.actors[actorName] = actor
        let profile = {
            actorName: actorName, 
            id: 'P' + this.timestamp,
            index: this.profiles.length,
            items: []
        }
        this.profiles.push(profile)
        if (this.prevArtifact.bodyYOffset == 0)
            this.prevArtifact.bodyYOffset = actor.bodyY
    }

    get profile() {
        const index = this.profiles.findIndex( (profile) => {
            return profile.actorName == this.actorFrom
        })
        return this.profiles[index]
    }

    addArtifact(packet) {
        packet.actorFrom = this.actorFrom
        packet.programIndex = this.program.length
        packet.bodyYOffset = this.prevArtifact.bodyYOffset
        packet.bodyHtFactor = this.prevArtifact.bodyHtFactor
        const artifact = factory.addArtifact(packet)
        let profile = state.profile
        artifact.index = profile.items.length
        artifact.id = 'A' + state.timestamp
        console.log('actor, artifact : ', packet.actorFrom, artifact)        
        // change the profile id, so vuejs will refresh the DOM
        profile.id = 'P' + state.timestamp
        profile.items.push(artifact)
        this.profiles[profile.index] = profile
        this.program.push(this.actorFrom)
        this.setHasFocus(artifact)
        this.prevArtifact = artifact
    }

    setVarsCM1(actorName) {
        this.actorFrom = actorName
        this.others = []
        for (let [name, actor] of Object.entries(this.actors)) {
            if (name != this.actorFrom)
                this.others.push({name: name,id: actor.id})
        }
    }

    setHasFocus(artifact) {
        Object.keys(this.actors).forEach( (actorName) => {
            if (artifact.type == 'transition')
                this.actors[actorName].svgOpacity = (actorName == artifact.actorTo) ? 1 : 0.5
            else
                this.actors[actorName].svgOpacity = (actorName == artifact.actorFrom) ? 1 : 0.5
        })
    }
}

const state = new UmlProgram(defaultLayout)

const mutations = {
    'ADD_ACTOR'(state, actorName) {
        state.addActor(actorName)
    },
    'ADD_ARTIFACT' (state, packet) {
        state.addArtifact(packet)
    },
    'SET_ACTOR' (state, actorName) {
        state.setVarsCM1(actorName)
    }
};

const actions = {
    addActor: ({commit}, actorName) => {
        commit('ADD_ACTOR', actorName)
        commit('SET_EVENT', {key: 'modalDialog01',value: false})
    },
    addArtifact: ({commit}, packet) => {
        console.log('packet : ', packet)
        commit('ADD_ARTIFACT', packet)
        commit('SET_EVENT', {key: 'contextMenu01',value: false})
    },
    setSvgLayout: () => {
        factory.setConfig(defaultLayout)
    },
    setActor: ({commit}, actorName) => {
        console.log('set actor : ', actorName)
        commit('SET_ACTOR', actorName)
        commit('SET_EVENT', {key: 'contextMenu01',value: true})
    }
};

const getters = {
    actors: state => {
        console.log('retrieve actors ...')
        return state.actors;
    },
    actor: state => (actorName) => {
        console.log('retrieve actor ... ', actorName)
        return state.actors[actorName]
    },
    actorFrom: state => {
      return state.actorFrom
    },
    bodyHtFactor: state => {
        return state.prevArtifact.bodyHtFactor
    },
    layout: state => {
        return state.layout
    },
    otherActors: state => {
        console.log('retrieve other actors ... ', state.others)
        return state.others      
    },
    profiles: state => {
        console.log('profiles getter called ...')
        return state.profiles
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};