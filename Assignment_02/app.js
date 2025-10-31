$(document).ready(function() {
    // --- Configuration & Global Elements ---
    const API_URL = 'https://jsonplaceholder.typicode.com/posts';
    const postForm = $('#post-form');
    const postsContainer = $('#posts-container');
    const loader = $('#loader');
    const formCard = $('#form-card');
    const formTitle = $('#form-title');

    // --- Button Elements ---
    const saveBtn = $('#btn-save');
    const updateBtn = $('#btn-update');
    const cancelBtn = $('#btn-cancel');

    // --- Form Input Elements ---
    const postIdInput = $('#post-id');
    const titleInput = $('#title');
    const bodyInput = $('#body');

    // =============================================
    // READ: Fetch and display all posts from the API
    // =============================================
    function fetchPosts() {
        loader.show();
        postsContainer.empty();

        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function(posts) {
                // The API returns 100 posts. Let's just display the first 12 for better performance.
                posts.slice(0, 12).forEach(post => {
                    const postCard = `
                        <div class="col-md-4 mb-4" data-id="${post.id}">
                            <div class="card h-100">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${post.title}</h5>
                                    <p class="card-text flex-grow-1">${post.body}</p>
                                </div>
                                <div class="card-footer bg-white border-0 text-end">
                                    <button class="btn btn-sm btn-outline-primary btn-edit">Edit</button>
                                    <button class="btn btn-sm btn-outline-danger btn-delete">Delete</button>
                                </div>
                            </div>
                        </div>
                    `;
                    postsContainer.append(postCard);
                });
            },
            error: function() {
                postsContainer.html('<div class="alert alert-danger">Error fetching posts. Please try again later.</div>');
            },
            complete: function() {
                loader.hide();
            }
        });
    }

    // --- Helper function to reset the form to its initial state ---
    function resetForm() {
        postForm[0].reset();
        postIdInput.val('');
        formTitle.text('Add New Post');
        formCard.removeClass('edit-mode');
        
        // Toggle button visibility
        saveBtn.show();
        updateBtn.hide();
        cancelBtn.hide();
    }

    // =============================================
    // CREATE: Handle form submission to create a new post
    // =============================================
    postForm.on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const title = titleInput.val().trim();
        const body = bodyInput.val().trim();

        if (!title || !body) {
            alert('Please fill in both title and content.');
            return;
        }

        // Send data to the API via a POST request
        $.ajax({
            url: API_URL,
            method: 'POST',
            data: {
                title: title,
                body: body,
                userId: 1 // This API requires a userId
            },
            success: function(newPost) {
                // Dynamically create the new post card
                const postCard = `
                    <div class="col-md-4 mb-4" data-id="${newPost.id}">
                        <div class="card h-100">
                             <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${newPost.title}</h5>
                                <p class="card-text flex-grow-1">${newPost.body}</p>
                            </div>
                            <div class="card-footer bg-white border-0 text-end">
                                <button class="btn btn-sm btn-outline-primary btn-edit">Edit</button>
                                <button class="btn btn-sm btn-outline-danger btn-delete">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
                // Add the new card to the top of the list
                postsContainer.prepend(postCard);
                resetForm();
                alert('Post created successfully!');
            },
            error: function() {
                alert('Error creating post. Please try again.');
            }
        });
    });

    // =============================================
    // UPDATE (Part 1): Handle the 'Edit' button click
    // =============================================
    postsContainer.on('click', '.btn-edit', function() {
        const postCard = $(this).closest('.col-md-4');
        const id = postCard.data('id');
        const title = postCard.find('.card-title').text();
        const body = postCard.find('.card-text').text();

        // Populate the form fields with the post data
        postIdInput.val(id);
        titleInput.val(title);
        bodyInput.val(body);

        // Switch the form to "edit mode"
        formTitle.text('Edit Post');
        formCard.addClass('edit-mode');
        saveBtn.hide();
        updateBtn.show();
        cancelBtn.show();

        // Smoothly scroll to the form for a better user experience
        $('html, body').animate({
            scrollTop: formCard.offset().top - 20 // -20 for a little padding
        }, 300);
    });

    // =============================================
    // UPDATE (Part 2): Handle the 'Update Post' button click
    // =============================================
    updateBtn.on('click', function() {
        const id = postIdInput.val();
        const title = titleInput.val().trim();
        const body = bodyInput.val().trim();

        if (!title || !body) {
            alert('Please fill in both title and content.');
            return;
        }

        // Send data to the API via a PUT request
        $.ajax({
            url: `${API_URL}/${id}`,
            method: 'PUT',
            data: {
                id: id,
                title: title,
                body: body,
                userId: 1
            },
            success: function(updatedPost) {
                // Find the specific card to update in the list
                const postToUpdate = postsContainer.find(`[data-id="${id}"]`);
                postToUpdate.find('.card-title').text(updatedPost.title);
                postToUpdate.find('.card-text').text(updatedPost.body);
                
                resetForm();
                alert('Post updated successfully!');
            },
            error: function() {
                alert('Error updating post.');
            }
        });
    });
    
    // --- Handle the 'Cancel Edit' button click ---
    cancelBtn.on('click', function() {
        resetForm();
    });

    // =============================================
    // DELETE: Handle the 'Delete' button click
    // =============================================
    postsContainer.on('click', '.btn-delete', function() {
        // Show a confirmation dialog before proceeding
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        const postCard = $(this).closest('.col-md-4');
        const id = postCard.data('id');

        // Send a DELETE request to the API
        $.ajax({
            url: `${API_URL}/${id}`,
            method: 'DELETE',
            success: function() {
                // Animate the card removal for a smooth effect
                postCard.fadeOut(400, function() {
                    $(this).remove();
                });
                alert('Post deleted successfully!');
            },
            error: function() {
                alert('Error deleting post.');
            }
        });
    });

    // --- Initial function call to load posts when the page is ready ---
    fetchPosts();
});