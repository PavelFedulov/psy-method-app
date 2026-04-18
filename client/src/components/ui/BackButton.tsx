import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

type Props = {
  fallbackPath?: string;
};

export function BackButton({ fallbackPath = '/admin' }: Props) {
  const navigate = useNavigate();

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath);
  }

  return (
    <Button type="button" variant="secondary" onClick={handleBack}>
      Назад
    </Button>
  );
}