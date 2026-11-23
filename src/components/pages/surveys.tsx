'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle2, Circle, ListChecks, Trash2, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import type { Survey } from '@/lib/types';
import {
  Coin,
  EmptyState,
  LoadingBlock,
  PageHeader,
  StatusBadge,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/* ------------------------------------------------------------------ */
/* Survey card                                                         */
/* ------------------------------------------------------------------ */

function SurveyCard({
  survey,
  isAdmin,
  onDeleted,
}: {
  survey: Survey;
  isAdmin: boolean;
  onDeleted: (id: number) => void;
}) {
  const canVote = survey.isActive && survey.myOptionId === null;

  return (
    <div className="panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-medium">{survey.title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={survey.isActive ? 'active' : 'finished'} />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {survey.totalVotes} голосов
          </span>
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-red-300"
              onClick={() => onDeleted(survey.id)}
              aria-label={`Удалить опрос «${survey.title}»`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {survey.question && <p className="mt-1 text-sm text-muted-foreground">{survey.question}</p>}

      <div className="mt-4 space-y-2">
        {canVote ? (
          <VoteOptions survey={survey} />
        ) : (
          <ResultOptions survey={survey} />
        )}
      </div>

      {survey.myOptionId !== null && (
        <div className="mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
            <Coin className="h-3.5 w-3.5" />
            +25 коинов за участие
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Vote mode ------------------------- */

function VoteOptions({ survey }: { survey: Survey }) {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: (vars: { surveyId: number; optionId: number }) =>
      api.surveys.vote(vars.surveyId, vars.optionId),
    onSuccess: () => {
      toast.success('Спасибо! +25 коинов');
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Не удалось проголосовать');
    },
  });

  return (
    <>
      {survey.options.map((option) => (
        <button
          key={option.id}
          type="button"
          disabled={voteMutation.isPending}
          onClick={() => voteMutation.mutate({ surveyId: survey.id, optionId: option.id })}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3 text-left transition hover:border-primary/60 disabled:pointer-events-none disabled:opacity-60"
        >
          <span className="text-sm">{option.text}</span>
          <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      ))}
    </>
  );
}

/* ----------------------------- Result mode ------------------------ */

function ResultOptions({ survey }: { survey: Survey }) {
  return (
    <>
      {survey.options.map((option) => {
        const percent =
          survey.totalVotes > 0 ? Math.round((option.votes / survey.totalVotes) * 100) : 0;
        const isMine = survey.myOptionId === option.id;
        return (
          <div
            key={option.id}
            className={cn(
              'rounded-xl border border-white/10 px-4 py-3 transition',
              isMine && 'border-primary/60 bg-primary/5'
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm">
                {isMine && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                {option.text}
              </span>
              <span className="shrink-0 text-sm text-muted-foreground tabular-nums-tight">
                {percent}%
              </span>
            </div>
            <Progress value={percent} className="mt-2 h-1.5" />
          </div>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SurveysPage(props: { params?: Record<string, string> }) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [optionsText, setOptionsText] = useState('');

  const surveysQuery = useQuery({
    queryKey: ['surveys'],
    queryFn: api.surveys.list,
  });

  const surveys: Survey[] = surveysQuery.data?.surveys ?? [];

  const createMutation = useMutation({
    mutationFn: (payload: { title: string; question?: string; options: string[] }) =>
      api.surveys.create(payload),
    onSuccess: () => {
      toast.success('Опрос создан');
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      setCreateOpen(false);
      setTitle('');
      setQuestion('');
      setOptionsText('');
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Не удалось создать опрос');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.surveys.delete(id),
    onSuccess: () => {
      toast.success('Опрос удалён');
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Не удалось удалить опрос');
    },
  });

  const parsedOptions = optionsText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const handleCreate = () => {
    createMutation.mutate({
      title: title.trim(),
      question: question.trim() || undefined,
      options: parsedOptions,
    });
  };

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="dots" />
      <PageContainer>
        <PageHeader
          title="Опросники"
          backHref="/room"
          description="Проходите опросы и получайте бонусную валюту. Ваше мнение формирует корпоративную культуру."
          actions={
            isAdmin ? (
              <Button onClick={() => setCreateOpen(true)}>Создать опрос</Button>
            ) : undefined
          }
        />

        {surveysQuery.isLoading ? (
          <LoadingBlock />
        ) : surveys.length === 0 ? (
          <EmptyState
            icon={<ListChecks className="h-5 w-5" />}
            title="Опросов пока нет"
            description={
              isAdmin
                ? 'Создайте первый опрос, чтобы узнать мнение команды.'
                : 'Как только появятся опросы, вы сможете пройти их здесь.'
            }
            action={
              isAdmin ? (
                <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
                  Создать опрос
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="max-w-3xl space-y-5">
            {surveys.map((survey) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                isAdmin={isAdmin}
                onDeleted={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        )}

        {/* ------------------------- Create dialog ------------------------ */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Новый опрос</DialogTitle>
              <DialogDescription>
                Опрос появится в списке, и сотрудники смогут проголосовать.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="survey-title">Заголовок</Label>
                <Input
                  id="survey-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Идеи для тимбилдинга"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="survey-question">Вопрос</Label>
                <Textarea
                  id="survey-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Что вы хотите узнать у команды?"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="survey-options">Варианты ответа</Label>
                <Textarea
                  id="survey-options"
                  value={optionsText}
                  onChange={(e) => setOptionsText(e.target.value)}
                  placeholder={'по одному варианту на строку'}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Отмена
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending || !title.trim() || parsedOptions.length < 2}
              >
                {createMutation.isPending ? 'Создаём...' : 'Создать'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </div>
  );
}
