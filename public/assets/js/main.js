document.addEventListener("DOMContentLoaded", bdapi);

function bdapi() {
	const selectRoute = document.getElementById('select-route');
	const templates = document.querySelectorAll('.route-template');
	const inputElement = document.getElementById('route-doc-input');

	templates.forEach( function(template, index) {
		const templateContent = template.content.cloneNode(true);
		if ( selectRoute.value == template.dataset.version) {
			inputElement.appendChild(templateContent);
		}
	});

	selectRoute.addEventListener('click', function(e) {
		inputElement.innerHTML = '';

		templates.forEach( function(template, index) {
			const templateContent = template.content.cloneNode(true);
			if ( template.dataset.version ==  e.target.value) {
				inputElement.appendChild(templateContent);
			}
		})
	})	
}
