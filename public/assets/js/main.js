document.addEventListener("DOMContentLoaded", bdapi);

function bdapi() {
	apiVersion();
}

function apiVersion() {
	const selectedBtn = document.getElementById('selected-version');
	const dropdown = document.getElementById('dropdown');
	const templates = document.querySelectorAll('.route-template');
	const inputElement = document.getElementById('route-doc-input');

	templates.forEach( function(template, index) {
		const templateContent = template.content.cloneNode(true);
		if ( selectedBtn.textContent == template.dataset.version) {
			inputElement.appendChild(templateContent);
		}
	});

	selectedBtn.addEventListener('click', function(e) {
		if ( dropdown.style.display == 'none' ) {
			dropdown.style.display = 'block';
			this.classList.add('show');
		} else {
			dropdown.style.display = 'none';
			this.classList.remove('show');
		}

		selectOption();
	})
}

function selectOption() {
	const selectOption = document.querySelectorAll('.select-version-option');
	const templates = document.querySelectorAll('.route-template');
	const inputElement = document.getElementById('route-doc-input');
	const dropdown = document.getElementById('dropdown');
	const selectedBtn = document.getElementById('selected-version');

	selectOption.forEach( function(option, index) {
		option.addEventListener('click', function(e) {
			inputElement.innerHTML = '';
	
			templates.forEach( function(template, index) {
				const templateContent = template.content.cloneNode(true);
				if ( template.dataset.version ==  option.dataset.version) {
					inputElement.appendChild(templateContent);
				}
			});

			selectedBtn.textContent = option.dataset.version;
			selectedBtn.classList.remove('show');
			dropdown.style.display = 'none';
		})
	} );
}
