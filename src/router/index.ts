import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreatorView from '../views/CreatorView.vue'
import ValidatorView from '../views/ValidatorView.vue'
import FormatterView from '../views/FormatterView.vue'
import DiffView from '../views/DiffView.vue'
import JsonPathView from '../views/JsonPathView.vue'
import InferrerView from '../views/InferrerView.vue'
import MergerView from '../views/MergerView.vue'
import FakerView from '../views/FakerView.vue'
import CsvView from '../views/CsvView.vue'
import YamlView from '../views/YamlView.vue'
import TypeScriptView from '../views/TypeScriptView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',           name: 'home',       component: HomeView       },
    { path: '/creator',    name: 'creator',    component: CreatorView    },
    { path: '/validator',  name: 'validator',  component: ValidatorView  },
    { path: '/formatter',  name: 'formatter',  component: FormatterView  },
    { path: '/diff',       name: 'diff',       component: DiffView       },
    { path: '/jsonpath',   name: 'jsonpath',   component: JsonPathView   },
    { path: '/inferrer',   name: 'inferrer',   component: InferrerView   },
    { path: '/merger',     name: 'merger',     component: MergerView     },
    { path: '/faker',      name: 'faker',      component: FakerView      },
    { path: '/csv',        name: 'csv',        component: CsvView        },
    { path: '/yaml',       name: 'yaml',       component: YamlView       },
    { path: '/typescript', name: 'typescript', component: TypeScriptView },
  ],
})
