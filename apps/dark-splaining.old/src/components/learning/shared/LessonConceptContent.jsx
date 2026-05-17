import { renderGlossaryText } from "../../../utils/renderGlossaryText";

export default function LessonConceptContent({ lesson }) {
    const concept = lesson.content.concept;

    return (
        <p>
            {renderGlossaryText(concept.text, concept.glossaryLinks)}
        </p>
    );
}
