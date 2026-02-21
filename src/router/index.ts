import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GeneratorView from '../views/GeneratorView.vue'
import ValidatorView from '../views/ValidatorView.vue'
import FormatterView from '../views/FormatterView.vue'
import DiffView from '../views/DiffView.vue'
import JsonPathView from '../views/JsonPathView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/generator',
      name: 'generator',
      component: GeneratorView,
    },
    {
      path: '/validator',
      name: 'validator',
      component: ValidatorView,
    },
    {
      path: '/formatter',
      name: 'formatter',
      component: FormatterView,
    },
    {
      path: '/diff',
      name: 'diff',
      component: DiffView,
    },
    {
      path: '/jsonpath',
      name: 'jsonpath',
      component: JsonPathView,
    },
  ],
})
