document.addEventListener('DOMContentLoaded', () => {
    fetch('/examples')
        .then(response => response.json())
        .then(data => {
            const menuContainer = document.getElementById('menu-container');
            const menu = renderMenu(data);
            menuContainer.appendChild(menu);
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

function renderMenu(data) {
    try {
        const ul = document.createElement('ul');
        data.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = item.name;
            a.href = item.path;
            li.appendChild(a);

            // Display files
            if (item.files && item.files.length > 0) {
                const filesUl = document.createElement('ul');
                item.files.forEach(file => {
                    const fileLi = document.createElement('li');
                    const fileA = document.createElement('a');
                    fileA.textContent = file;
                    fileA.href = item.path + '/' + file; // Adjust the href based on the file's path
                    fileA.onclick = () => {
                        renderFile(item.path + '/' + file);
                        return false; // Prevent default link behavior
                    };
                    fileLi.appendChild(fileA);
                    filesUl.appendChild(fileLi);
                });
                li.appendChild(filesUl);
            }

            // Recursively render subdirectories
            if (item.subdirectories && item.subdirectories.length > 0) {
                const subUl = renderMenu(item.subdirectories);
                li.appendChild(subUl);
            }

            ul.appendChild(li);
        });
        return ul;
    } catch (error) {
        console.error('Error rendering menu:', error);
        return null;
    }
}

function renderFile(filePath) {
    const iframe = document.getElementById('file-iframe');
    iframe.src = filePath;
}
