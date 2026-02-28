# Just Some AI Tips — Brief projet

## Qui sommes-nous

- **Boris Koulevo** — Data Scientist, Master en IA. LinkedIn : linkedin.com/in/boris-koulevo-0369411a3
- **Kevin Tiassou** — Data Engineer. LinkedIn : linkedin.com/in/kevintiassou

On gere une chaine WhatsApp qui s'appelle **Just Some AI Tips**. On partage des decouvertes autour de l'IA, de la Data et de la Tech.

### Bio de la chaine
> Hello nous sommes Kevin & Boris et nous te partageons nos decouvertes autour de l'IA, de la Data et de la Tech en general

## Ce qu'on fait

On partage :
- **Des prompts** : prompts testes avec images du resultat, bouton copier, explications etape par etape de comment modifier le prompt pour obtenir des variantes
- **Des tutoriels** : guides detailles avec screenshots/images a l'appui, etapes numerotees, pour utiliser un outil ou un modele sur un use case precis (ex: faire un PowerPoint avec l'IA, generer des images, automatiser des taches)
- **Des articles** : contenus plus longs sur un sujet en particulier
- **Des astuces** : petites decouvertes, tips rapides

Le contenu est **pratique et concret** — pas de hype, pas de benchmarks, pas de "ce modele va revolutionner le monde". On va chercher des use cases vraiment utiles aux gens.

## Le site

Un site statique pour heberger ces contenus. Les gens arrivent via des liens partages dans WhatsApp (ou autres reseaux).

### Stack
- HTML + CSS + vanilla JS pur
- Pas de framework, pas de build, pas de npm
- Deploiement sur GitHub Pages

### Arborescence

```
just-some-ai-tips/
  style.css                 <- design system global, applique a toutes les pages
  index.html                <- landing page
  posts/
    _template/
      index.html            <- squelette a copier pour chaque nouveau post
    nom-du-post/
      index.html            <- article complet
      assets/               <- images specifiques a ce post
    autre-post/
      index.html
      assets/
```

### Principes

- **Un `style.css` global** a la racine qui definit les tokens (couleurs, typo, spacing) et les composants reutilisables (cards, prompt blocks, step blocks, callouts, tags, etc.). Toutes les pages l'importent.
- **Chaque article est un dossier** dans `posts/` avec son propre `index.html` et ses assets. URL propre : `site.com/posts/nom-du-post/`
- **Un template** dans `posts/_template/` a copier pour chaque nouveau post
- **La landing page** presente qui on est et liste les contenus
- **Chaque page est codee a la main** — pas de generation automatique. Le CSS global assure la coherence.

### Responsive
Le site doit etre responsive — bien rendu sur desktop ET mobile. Les utilisateurs viendront des deux.

### Lien WhatsApp
Bouton pour rejoindre la chaine WhatsApp. Le lien exact de la chaine sera renseigne plus tard.
