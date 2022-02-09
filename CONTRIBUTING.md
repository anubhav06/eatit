# CONTRIBUTING

First off, thank you for considering contributing to EatIN!

* **Create an issue**: If you have noticed a bug, want to contribute features, or simply ask a question that for whatever reason 
please [search the issue tracker](https://github.com/anubhav06/eatit/issues) to see if someone else in the community has already created a ticket. 
If not, go ahead and [create an issue](https://github.com/anubhav06/eatit/issues/new/choose).


This document lays out how to get you started in contributing, so please read on.

### Fork Repositories and work in a branch

* Branch away from the `main` branch and use the following schema for naming your branches:
```
<github-issue-number>/<descriptive-name-with-dashes>

Example:
3/fix-css
```

### Commiting code ###

```
$ git add .
$ git commit -m "fixed css"
$ git push
```

### Make a Pull Request

At this point, you should make sure that your branch is up to date with `main` branch of eatit:

```bash
$ git remote add upstream git@github.com:anubhav06/eatit.git
$ git pull upstream main
```


Finally, go to GitHub and create a Pull Request.
