# web-component-blogpost-demos


````

document.querySelector('#html-data-prop').data

document.querySelector('#html-data-prop').data = {
  length: 10,
  width: 10,
  depth: 10,
}

console.log(document.querySelector('#html-data-prop').getAttribute('units'))
console.log(document.querySelector('#html-data-prop').units)
document.querySelector('#html-data-prop').units = 'imperial'
console.log(document.querySelector('#html-data-prop').getAttribute('units'))
`````
