document.addEventListener('DOMContentLoaded', () => {
    // Log the entire DOM to see what elements are present
    console.log(document.body.innerHTML);

    // Use a parent node that contains the element you're interested in
    const parentNode = document.getElementById('parentElementId'); // Change to your actual parent element's ID

    if (!parentNode) {
        console.error('Parent node not found. Please ensure the element exists in the DOM.');
        return; // Exit if the parent node is not found
    }

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            console.log('Mutation observed:', mutation);

            // Check if the target node has been added to the DOM
            const targetNode = document.getElementById('myElementId'); // Change to your actual target element's ID
            if (targetNode) {
                console.log('Target node found:', targetNode);
                // Here you can observe or manipulate the target node as needed
            }
        });
    });

    // Start observing the parent node for child elements being added
    observer.observe(parentNode, { childList: true, subtree: true });
    console.log('MutationObserver is set up for parent node:', parentNode);
});

// Optional: Use a timeout for debugging if the target node is created dynamically
setTimeout(() => {
    const targetNode = document.getElementById('myElementId'); // Same ID as above

    if (!targetNode) {
        console.error('Target node not found after timeout. Please ensure the element exists in the DOM.');
        return; // Exit if the target node is not found
    }

    console.log('Target node found after timeout:', targetNode);
}, 1000); // 1000 ms timeout (1 second)
