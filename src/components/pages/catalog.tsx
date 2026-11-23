'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Package2, Search, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CoinAmount,
  EmptyState,
  PageHeader,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 to-transparent">
        <Package2 className="h-10 w-10 text-muted-foreground/60" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover"
      onError={() => setError(true)}
    />
  );
}

const CHIP_BASE =
  'rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors';
const CHIP_ACTIVE = 'bg-primary text-primary-foreground';
const CHIP_IDLE =
  'border border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground';

export default function CatalogPage() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, search],
    queryFn: () =>
      api.products.list({ category: category || undefined, search: search || undefined }),
  });

  const products = data?.products ?? [];
  const categories = data?.categories ?? [];

  const addMutation = useMutation({
    mutationFn: (productId: number) => api.cart.add(productId, 1),
    onSuccess: () => {
      toast.success('Добавлено в корзину');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="grid" />
      <PageContainer>
        <PageHeader
          title="Каталог"
          description="Корпоративная витрина: зарабатывайте внутреннюю валюту и тратьте её на товары и услуги компании."
        />

        {/* Search */}
        <form onSubmit={(event) => event.preventDefault()} className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск товаров..."
            className="pl-9"
          />
        </form>

        {/* Category chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" data-lenis-prevent>
          <button
            type="button"
            onClick={() => setCategory('')}
            className={cn(CHIP_BASE, !category ? CHIP_ACTIVE : CHIP_IDLE)}
          >
            Все
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(CHIP_BASE, category === item ? CHIP_ACTIVE : CHIP_IDLE)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="mt-6">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="panel overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={<Package2 className="h-5 w-5" />}
              title="Товары не найдены"
              description="Измените поисковый запрос или выберите другую категорию."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.04, 0.3),
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                  className="panel panel-hover flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-white/5">
                    <ProductImage src={product.imageUrl} alt={product.title} />
                    {product.stock < 5 && (
                      <span className="absolute right-3 top-3 rounded-full border border-amber-400/30 bg-amber-400/15 px-2.5 py-0.5 text-xs font-medium text-amber-300 backdrop-blur-sm">
                        Осталось {product.stock}
                      </span>
                    )}
                  </div>

                  <div className="flex grow flex-col gap-2 p-5">
                    <h3 className="font-medium">{product.title}</h3>
                    {product.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-auto pt-2">
                      <CoinAmount
                        value={product.price}
                        className="text-lg text-amber-300"
                        iconClassName="h-4 w-4"
                      />
                    </div>
                    <Button
                      className="w-full"
                      disabled={
                        addMutation.isPending && addMutation.variables === product.id
                      }
                      onClick={() => addMutation.mutate(product.id)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      В корзину
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
