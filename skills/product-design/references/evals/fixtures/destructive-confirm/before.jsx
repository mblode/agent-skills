// Defect: the destructive confirmation hides what it does behind "Confirm",
// states no object/scope/consequence, and clears the form on a failed submit.
export function DeleteProjectDialog({ project, onClose }) {
  return (
    <Modal onClose={onClose}>
      <h2>Are you sure?</h2>
      <p>This action cannot be undone.</p>
      <Button variant="danger" onClick={() => deleteProject(project.id)}>
        Confirm
      </Button>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
    </Modal>
  );
}
