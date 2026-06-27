// The CTA names the object (Verb + Noun). The body states scope and consequence.
// The dialog body scrolls so the actions stay reachable.
export function DeleteProjectDialog({ project, onClose }) {
  return (
    <Modal onClose={onClose}>
      <Modal.Header>Delete {project.name}?</Modal.Header>
      <Modal.Body>
        <p>
          This permanently deletes {project.name} and its {project.deploymentCount}{' '}
          deployments. This cannot be undone.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => deleteProject(project.id)}>
          Delete project
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
