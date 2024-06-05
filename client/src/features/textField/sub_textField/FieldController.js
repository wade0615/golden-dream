import { Controller, useFormContext } from 'react-hook-form';
import { FormNote, FormFeedback } from 'components/form';

function FieldController({
  name = '',
  renderComponent = null,
  isValid = false,
  fineMessage = '',
  formRules = {},
  isFeedBack = true,
  note = '',
  className
}) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={formRules}
      render={(props) => {
        const {
          fieldState: { error }
        } = props;

        return (
          <div className={className}>
            {renderComponent(props)}
            {isFeedBack && (
              <>
                <FormFeedback
                  type={!isValid ? 'invalid' : 'valid'}
                  errorMessage={error?.message}
                  fineMessage={fineMessage}
                />
                <FormNote text={note} />
              </>
            )}
          </div>
        );
      }}
    />
  );
}

export default FieldController;
