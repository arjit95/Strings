//Adding require inside function to reduce load while loading main window
function loadDeps() {
    console.log("Bootstrapping started");
    const menuRenderer = rootRequire('modules/menu/menuRenderer');
    menuRenderer.render();
    console.log("Bootstrapping completed");
}

module.exports = {
    load: loadDeps
}